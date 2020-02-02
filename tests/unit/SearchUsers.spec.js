import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import SearchUsers from "@/components/SearchUsers.vue";

describe("Some Simple Testing", () =>
{
    let wrapper;
    
    beforeEach(() =>
    {
        wrapper = shallowMount(SearchUsers);
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

        SearchButton.trigger("click");
        expect(ErrorMessageElement.text()).to.be.equal("Search field cannot be empty!").and.not.to.be.empty;
    });
});