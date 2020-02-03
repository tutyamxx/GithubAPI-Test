/* eslint-disable no-console */
import { expect } from "chai";
import { mount } from "@vue/test-utils";
import SearchUsers from "@/components/SearchUsers.vue";

describe("Some Simple Testing", () =>
{
    let wrapper;
    
    beforeEach(() =>
    {
        wrapper = mount(SearchUsers);
    });

    it("Should render the search box", () =>
    {
        const SearchBox = wrapper.find("input");

        expect(SearchBox.attributes("class")).to.be.equal("search");
        expect(SearchBox).to.exist.to.be.empty;
    });

    it("Should have a button named search", () =>
    {
        const SearchButton = wrapper.find("button");

        expect(SearchButton.attributes("id")).to.be.equal("search-user");
        expect(SearchButton).to.exist.to.be.a("object");
        expect(Object.keys(SearchButton).length).to.be.equal(0);
        expect(SearchButton.text()).to.be.equal("Search");
    });

    it("Should not allow to search empty values", () =>
    {
        const SearchButton = wrapper.find("button");

        expect(SearchButton.attributes("id")).to.be.equal("search-user");
        expect(SearchButton).to.exist.to.be.a("object");
        expect(Object.keys(SearchButton).length).to.be.equal(0);

        const ErrorMessageElement = wrapper.find("span");
        expect(ErrorMessageElement.is("span")).to.be.true;

        SearchButton.trigger("click");
        expect(ErrorMessageElement.text()).to.be.equal("Search field cannot be empty!").and.not.to.be.empty;
    });

    it("Should load the animation upon search", () =>
    {
        const SearchButton = wrapper.find("button");

        expect(SearchButton.attributes("id")).to.be.equal("search-user");
        expect(SearchButton).to.exist.to.be.a("object");
        expect(Object.keys(SearchButton).length).to.be.equal(0);
        expect(SearchButton.text()).to.be.equal("Search");

        const SearchBox = wrapper.find('input[type="text"]');
        expect(SearchBox.attributes("class")).to.be.equal("search");
        SearchBox.setValue("testing loading");

        SearchButton.trigger("click");

        const LoadingAnimationDiv = wrapper.find(".loading");
        expect(LoadingAnimationDiv.isVisible()).to.be.true;
    });

    afterEach(() => { wrapper.destroy() });
});